import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category, image }) => {
    return (
        <NavLink 
            to={`/products?category=${category}`}
            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/50"
        >
            <div className="relative aspect-[16/9]">
                <img
                    src={image}
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-70" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {category}
                    </h3>
                    <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
                        <span className="text-sm">Explore Category</span>
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </NavLink>
    );
};

export default CategoryCard;


/*
   <dl className="grid grid-cols-1 gap-8 mt-16 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                            {stats.map((stat) => (
                                <div key={stat.name} className="flex flex-col-reverse">
                                    <dt className="text-base leading-7 text-gray-300">{stat.name}</dt>
                                    <dd className="text-2xl font-bold leading-9 tracking-tight text-white">{stat.value}</dd>
                                </div>
                            ))}
                        </dl>
*/