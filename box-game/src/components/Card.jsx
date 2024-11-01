import React from 'react';

const Card = ({ children }) => {
    return (
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg text-center dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            {children}
        </div>
    );
};

export default Card;
