import React, { useState } from 'react';

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="mt-16">
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto hide-scrollbar gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm md:text-base whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-ayurveda text-ayurveda'
                  : 'border-transparent text-gray-500 hover:text-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="py-8">
        {activeTab === 'description' && (
          <div className="prose prose-sm sm:prose max-w-none text-dark-body space-y-4">
            <p>{product.description || 'This premium Ayurvedic formulation is carefully crafted using ancient principles to support your journey to holistic wellness. Sourced from the finest natural ingredients, it works harmoniously with your body to restore balance and vitality.'}</p>
            <p>Our traditional preparation methods ensure that the potent properties of each herb are fully preserved, delivering maximum efficacy in every dose.</p>
          </div>
        )}
        
        {activeTab === 'ingredients' && (
          <div className="prose prose-sm sm:prose max-w-none text-dark-body">
            <p className="mb-4">Crafted with 100% natural, potent Ayurvedic herbs:</p>
            {product.ingredients ? (
              <p>{product.ingredients}</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Ashwagandha (Withania somnifera):</strong> Known as an adaptogen that helps the body manage stress.</li>
                <li><strong>Shatavari (Asparagus racemosus):</strong> Traditionally used to support vitality and immune function.</li>
                <li><strong>Tulsi (Holy Basil):</strong> Revered for its purifying and respiratory support properties.</li>
                <li><strong>Turmeric (Curcuma longa):</strong> A powerful antioxidant that supports joint health and immune response.</li>
              </ul>
            )}
          </div>
        )}
        
        {activeTab === 'benefits' && (
          <div className="text-dark-body">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(product.benefits || [
                'Supports natural immunity and resistance',
                'Helps manage daily stress and fatigue',
                'Promotes healthy digestion and metabolism',
                'Enhances overall vitality and energy levels',
                'Balances the doshas (Vata, Pitta, Kapha)',
                'Supports cognitive function and clarity'
              ]).map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-ayurveda mt-1">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="text-center py-8">
            <h4 className="text-lg font-medium text-dark mb-2">Customer Reviews</h4>
            <p className="text-gray-500 mb-6">No reviews yet for this product. Be the first to review!</p>
            <button className="px-6 py-2 border border-ayurveda text-ayurveda rounded hover:bg-ayurveda hover:text-white transition-colors">
              Write a Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
