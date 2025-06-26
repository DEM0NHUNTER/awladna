import { useTheme } from '@/context/ThemeContext';
import { IoMoon, IoSunny } from 'react-icons/io5';

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-xl transition-colors">
      {dark ? <IoSunny /> : <IoMoon />}
    </button>
  );
}
