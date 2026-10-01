import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
      <Link to={`/blog/${blog.slug}`} className="block relative aspect-[3/2] bg-cream-light overflow-hidden">
        {blog.image ? (
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl hover:scale-110 transition-transform duration-500">📖</div>
        )}
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{blog.author}</span>
          <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        
        <h3 className="font-heading font-bold text-xl text-dark mb-3 line-clamp-2 hover:text-ayurveda transition-colors">
          <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h3>
        
        <p className="text-dark-body text-sm line-clamp-3 mb-4 flex-grow">
          {blog.excerpt}
        </p>
        
        <Link to={`/blog/${blog.slug}`} className="text-ayurveda font-medium text-sm hover:text-ayurveda-dark transition-colors mt-auto inline-flex items-center gap-1">
          Read More →
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
