import React from 'react';
import { formatPrice } from '../../utils/formatPrice';
import { Link } from 'react-router-dom';
import { LuChevronRight } from 'react-icons/lu';

const OrderCard = ({ order }) => {
  // Status styling
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'in transit': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4 hover:shadow-sm transition-shadow">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div>
            <span className="text-gray-500 block">Order Date</span>
            <span className="font-medium text-dark">
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Total Amount</span>
            <span className="font-medium text-dark">{formatPrice(order.totalAmount)}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Order ID</span>
            <span className="font-medium text-dark">{order._id || order.id}</span>
          </div>
        </div>
        <div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>
      
      <div className="px-6 py-4">
        {order.items && order.items.map((item, index) => (
          <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="w-16 h-16 bg-cream-light rounded overflow-hidden flex items-center justify-center">
               <span className="text-2xl">🌿</span>
            </div>
            <div className="flex-grow">
              <h4 className="font-medium text-dark text-sm sm:text-base line-clamp-1">{item.name || 'Ayurvedic Product'}</h4>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="font-medium">
              {formatPrice(item.price)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
        <Link to="#" className="text-ayurveda font-medium text-sm hover:text-ayurveda-dark transition-colors flex items-center gap-1">
          View Details <LuChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
