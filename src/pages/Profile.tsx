import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from '../components/layout/Sidebar';
import { useTranslation } from 'react-i18next';

interface Child {
  id: number;
  name: string;
  age: number;
  gender: "Male" | "Female";
  school?: string;
  challenges?: string;
}

const defaultAvatar = "https://ui-avatars.com/api/?name=User&background=000080&color=fff&size=128";

const Profile: React.FC = () => {
  const { user, updateUser, children, setChildren } = useAuth();
  const [avatar, setAvatar] = useState<string>(user?.picture || defaultAvatar);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [showChildForm, setShowChildForm] = useState(false);
  const [childForm, setChildForm] = useState<Partial<Child>>({});
  const [editChildId, setEditChildId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target?.result as string);
        updateUser({ picture: ev.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleAvatarRemove = () => {
    setAvatar(defaultAvatar);
    updateUser({ picture: defaultAvatar });
  };

  // Name edit
  const handleNameSave = () => {
    updateUser({ name });
    setEditingName(false);
  };

  // Child form handlers
  const openAddChild = () => {
    setChildForm({});
    setEditChildId(null);
    setShowChildForm(true);
  };
  const openEditChild = (child: Child) => {
    setChildForm(child);
    setEditChildId(child.id);
    setShowChildForm(true);
  };
  const handleChildFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setChildForm({ ...childForm, [e.target.name]: e.target.value });
  };
  const handleChildFormSave = () => {
    if (!childForm.name || !childForm.age || !childForm.gender) return;
    if (editChildId !== null) {
      setChildren(children.map(c => c.id === editChildId ? { ...c, ...childForm } as Child : c));
      } else {
      setChildren([...children, { ...childForm, id: Date.now() } as Child]);
    }
    setShowChildForm(false);
    setChildForm({});
    setEditChildId(null);
  };
  const handleChildDelete = (id: number) => setChildren(children.filter(c => c.id !== id));

  // Determine childId for Sidebar: use first child if available, else '1'
  const sidebarChildId = children?.length > 0 ? children?[0].id.toString() : '1';

  // Sidebar open/collapse state
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // for desktop

  return (
    <div className={`min-h-screen bg-white flex flex-row ${isRTL ? 'flex-row-reverse' : ''}`}>
      {/* Sidebar: fixed on desktop, overlays on mobile */}
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col h-full z-30 bg-gradient-to-b from-[#000080] to-[#000080]/90 shadow-xl fixed top-0 ${isRTL ? 'right-0' : 'left-0'} transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-80'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Sidebar childId={sidebarChildId} collapsed={sidebarCollapsed} />
        {/* Collapse/Expand Button */}
        <button
          className={`absolute bottom-4 ${isRTL ? 'left-4' : 'right-4'} bg-white/20 text-white rounded-full p-2 hover:bg-white/30 transition md:block hidden`}
          onClick={() => setSidebarCollapsed(c => !c)}
          aria-label={sidebarCollapsed ? t('expandSidebar', 'Expand sidebar') : t('collapseSidebar', 'Collapse sidebar')}
        >
          {sidebarCollapsed ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          )}
        </button>
      </aside>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className={`relative w-64 bg-gradient-to-b from-[#000080] to-[#000080]/90 shadow-xl h-full z-50 ${isRTL ? 'right-0' : 'left-0'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <Sidebar childId={sidebarChildId} onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}
      {/* Main Profile Area: offset for sidebar */}
      <main className={`flex-1 min-h-screen pt-8 pb-safe transition-all duration-300 ${sidebarCollapsed ? (isRTL ? 'md:mr-20' : 'md:ml-20') : (isRTL ? 'md:mr-80' : 'md:ml-80')}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Hamburger Button for mobile */}
        <button
          className={`md:hidden fixed top-4 ${isRTL ? 'right-4' : 'left-4'} z-50 bg-[#000080] text-white rounded-full p-2 shadow-lg`}
          onClick={() => setSidebarOpen(true)}
          aria-label={t('openSidebar', 'Open sidebar')}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div className="max-w-3xl mx-auto py-8 px-2 md:px-0">
          {/* User Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <img
                src={avatar}
                alt="User Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#000080]"
              />
              <button
                className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg"
                onClick={() => fileInputRef.current?.click()}
                title={t('uploadPhoto')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l3 3 8-8M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
              </button>
              {avatar !== defaultAvatar && (
                <button
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-lg"
                  onClick={handleAvatarRemove}
                  title={t('removePhoto')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex-1 w-full">
              <h1 className="text-3xl font-bold mb-4">{t('myProfile')}</h1>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">{t('fullName')}</label>
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      className="border rounded px-3 py-2 w-full"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
                      onClick={handleNameSave}
                    >
                      {t('save')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      className="border rounded px-3 py-2 w-full bg-gray-100 cursor-default"
                      value={name}
                      readOnly
                    />
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                      onClick={() => setEditingName(true)}
                      title={t('edit')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l3 3 8-8M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 font-semibold mb-1">{t('emailAddress')}</label>
                <input
                  className="border rounded px-3 py-2 w-full bg-gray-100 cursor-default"
                  value={user?.email || ""}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* My Children Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{t('myChildren')}</h2>
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-xl font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition"
                onClick={openAddChild}
              >
                {t('addChildButton')}
              </button>
            </div>
            {children?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-500 mb-2">{t('noChildren')}</p>
                <p className="text-gray-400 mb-4">{t('addChildrenInfo')}</p>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold"
                  onClick={openAddChild}
                >
                  {t('addFirstChild')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {children.map(child => (
                  <div key={child.id} className="bg-gray-50 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-bold text-lg mb-1">{child.name}</div>
                      <div className="text-gray-700 text-sm mb-1">{t('age')}: {child.age} {t('yearsOld')}</div>
                      <div className="text-gray-700 text-sm mb-1">{t('gender')}: {t(child.gender.toLowerCase())}</div>
                      {child.school && <div className="text-gray-700 text-sm mb-1">{t('school')}: {child.school}</div>}
                      {child.challenges && <div className="text-gray-700 text-sm">{t('currentChallenges')}: {child.challenges}</div>}
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
                        onClick={() => openEditChild(child)}
                        title={t('edit')}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l3 3 8-8M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                        onClick={() => handleChildDelete(child.id)}
                        title={t('delete')}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add/Edit Child Modal */}
          {showChildForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Close Button */}
                <button
                  className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none`}
                  onClick={() => setShowChildForm(false)}
                  aria-label={t('close', 'Close')}
                >
                  &times;
                </button>
                <h3 className="text-2xl font-bold mb-6">{editChildId !== null ? t('editChild') : t('addChild')}</h3>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">{t('childName')}</label>
                  <div className="relative">
        <input
                      className="border rounded-xl px-4 py-3 w-full pl-12 focus:ring-2 focus:ring-blue-200"
          name="name"
                      placeholder={t('enterChildName')}
                      value={childForm.name || ""}
                      onChange={handleChildFormChange}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">{t('age')} *</label>
                  <div className="relative">
        <input
                      className="border rounded-xl px-4 py-3 w-full pl-12 focus:ring-2 focus:ring-blue-200"
                      name="age"
                      type="number"
                      min="0"
                      placeholder={t('age')}
                      value={childForm.age || ""}
                      onChange={handleChildFormChange}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">{t('gender')} *</label>
                  <select
                    className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-200"
          name="gender"
                    value={childForm.gender || ""}
                    onChange={handleChildFormChange}
                  >
                    <option value="">{t('selectGender')}</option>
                    <option value="Male">{t('male')}</option>
                    <option value="Female">{t('female')}</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">{t('school')}</label>
                  <div className="relative">
                    <input
                      className="border rounded-xl px-4 py-3 w-full pl-12 focus:ring-2 focus:ring-blue-200"
                      name="school"
                      placeholder={t('enterSchoolName')}
                      value={childForm.school || ""}
                      onChange={handleChildFormChange}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">{t('currentProblems')}</label>
                  <textarea
                    className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-200"
                    name="challenges"
                    placeholder={t('describeChallenges')}
                    value={childForm.challenges || ""}
                    onChange={handleChildFormChange}
                  />
                </div>
                <div className="flex gap-2 justify-end mt-6">
          <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl"
                    onClick={() => setShowChildForm(false)}
          >
                    {t('cancel')}
          </button>
          <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold"
                    onClick={handleChildFormSave}
          >
                    {t('save')}
          </button>
                </div>
              </div>
            </div>
        )}
      </div>
      </main>
    </div>
  );
};

export default Profile;
