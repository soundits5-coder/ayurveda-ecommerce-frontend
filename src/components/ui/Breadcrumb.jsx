import React from 'react';
import { Link } from 'react-router-dom';
import { LuChevronRight } from 'react-icons/lu';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex text-sm text-dark-muted py-4 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <LuChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
            {index === items.length - 1 ? (
              <span className="font-medium text-dark-body" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link to={item.href} className="hover:text-ayurveda transition-colors">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
