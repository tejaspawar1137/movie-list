import { Package, Calendar, CreditCard } from 'lucide-react';

const OrderCard = ({ order }) => {
    const { orderDate, items, totalAmount, paymentMethod, status } = order;

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'processing':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'cancelled':
                return 'bg-red-500/20 text-red-300 border-red-500/30';
            default:
                return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300">
            {/* Order Header */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-white/70">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                            {new Date(orderDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
                        {status}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/70">
                        <Package className="h-4 w-4" />
                        <span className="text-sm">{items.length} items</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm">{paymentMethod}</span>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="p-4">
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-4">
                            <img
                                src={item.coverImage}
                                alt={item.title}
                                className="w-16 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h4 className="text-white font-medium line-clamp-1">{item.title}</h4>
                                <p className="text-white/70 text-sm">Qty: {item.quantity}</p>
                                <p className="text-white/70 text-sm">₹{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                    <span className="text-white/70">Total Amount</span>
                    <span className="text-lg font-bold text-white">₹{totalAmount}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;