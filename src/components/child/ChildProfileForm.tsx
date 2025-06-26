import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

export default function ChildProfileForm({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="fixed top-20 right-8 z-50 w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add Child Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
            <IoClose size={24} />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Name</label>
            <input type="text" className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Birth Date</label>
            <input type="date" className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
