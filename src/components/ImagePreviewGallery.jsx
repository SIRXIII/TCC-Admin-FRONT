import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const ImagePreviewGallery = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  const FIXED_SIZE = 700; // adjust as needed

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative rounded-2xl flex items-center justify-center"
          style={{ width: FIXED_SIZE, height: FIXED_SIZE }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          {/* Close button */}
          <button
            className="absolute top-3 right-3 text-white text-2xl hover:text-gray-300 transition"
            onClick={onClose}
          >
            <FaTimes />
          </button>

          {/* Image */}
          <img
            src={imageUrl}
            alt="preview"
            className="w-full h-full object-contain rounded-xl shadow-lg"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImagePreviewGallery;
