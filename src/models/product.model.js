import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const productSchema = new Schema({
    title: { type: String, required: [true, 'El titulo es obligatorio'], index:{ name: 'idx_title'} },
    description: { type: String, required: [true, 'La descripcion es obligatoria']},
    code: { type: String, required: [true, 'El codigo es obligatorio'], unique: [true, 'Este codigo ya existe, debe ser unico'] },
    status: { type: Boolean, default: true , required: [true, 'El estado es obligatorio'] },
    price: { type: Number, required: [true, 'El precio es obligatorio'] , min: [0, 'El precio no puede ser negativo'] },
    stock: { type: Number, required: [true, 'El stock es obligatorio']  , min: [0, 'El stock no puede ser negativo'] },
    category: {
        type: String,
        required: [true, 'La categoria es obligatoria'],  
        enum: ['Proteinas', 'Suplementos', 'Accesorios', 'Vitaminas', 'Equipamiento', 'Calzado', 'Ropa', 'Otros' ],
    },
    thumbnail: { type: String, required:  false },
});

productSchema.plugin(paginate);

const productModel = model('Product', productSchema); // El modelo debe tener un nombre consistente: 'Product'.

export default productModel;
