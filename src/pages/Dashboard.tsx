// src/pages/DashboardPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';
import { useTranslation } from 'react-i18next';

// SVG Icons for the dashboard
const MessageCircle = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const User = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Calendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Heart = () => (
  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

// Exact HeartLogo as in Navbar
const HeartLogo = () => (
  <span className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-400 to-purple-500">
    <svg className="w-10 h-10" fill="none" stroke="white" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  </span>
);

// Modern filled red heart for 'Your Parenting Journey'
const RedHeart = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#ef4444" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, children } = useAuth();
  const { chats } = useChatContext();
  const { t } = useTranslation();

  useEffect(() => {
    const original = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#c7d2fe';
    return () => {
      document.body.style.backgroundColor = original;
    };
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('dashboardWelcome', { name: user?.name || user?.email || t('profile') })}
        </h1>
              <div className="flex items-center text-gray-600">
                <Calendar />
                <span className="ml-2">{getTodayDate()}</span>
              </div>
            </div>
            <div className="hidden md:block">
              <HeartLogo />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('whatAwladnaOffers')}</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  {t('personalizedGuidance')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  {t('childSpecificAdvice')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  {t('aiSupport')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  {t('expertRecommendations')}
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('yourParentingJourney')}</h3>
              <p className="text-gray-700 mb-4">
                {t('parentingJourneyDesc')}
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <RedHeart />
                <span className="ml-2">{t('trustedByParents')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Chat Card */}
          <div 
            onClick={() => navigate('/chat')}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-xl group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#000080] to-[#000080]/90 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{t('chat')}</div>
                <div className="text-gray-500">{t('getInstantHelp')}</div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              {t('chatCardDesc')}
            </p>
            <div className="flex items-center text-[#000080] font-semibold">
              <span>{t('startChatting')}</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>

          {/* Profile Card */}
          <div 
            onClick={() => navigate('/profile')}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-xl group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <User />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{t('profile')}</div>
                <div className="text-gray-500">{t('manageYourInfo')}</div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              {t('profileCardDesc')}
            </p>
            <div className="flex items-center text-green-600 font-semibold">
              <span>{t('manageProfile')}</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>

          {/* Feedback Card */}
          <div
            onClick={() => navigate('/feedback')}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-xl group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29a1 1 0 00.95.69h6.6c.969 0 1.371 1.24.588 1.81l-5.347 3.89a1 1 0 00-.364 1.118l2.036 6.29c.3.921-.755 1.688-1.54 1.118l-5.347-3.89a1 1 0 00-1.176 0l-5.347 3.89c-.784.57-1.838-.197-1.54-1.118l2.036-6.29a1 1 0 00-.364-1.118l-5.347-3.89c-.783-.57-.38-1.81.588-1.81h6.6a1 1 0 00.95-.69l2.036-6.29z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{t('feedback')}</div>
                <div className="text-gray-500">{t('shareYourThoughts')}</div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              {t('feedbackCardDesc')}
            </p>
            <div className="flex items-center text-orange-500 font-semibold">
              <span>{t('giveFeedback')}</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('yourAwladnaStats')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#000080] mb-2">
                {children.length}
              </div>
              <div className="text-gray-600">{t('childrenAdded')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{chats.length}</div>
              <div className="text-gray-600">{t('chatSessions')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


