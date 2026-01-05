import mongoose, { InferSchemaType, Model, Schema, model, models } from "mongoose";

const priceHistorySchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    availability: {
        type: Boolean,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    mostRecentPrice: {
        type: Number,
    },
    mostRecentDate: {
        type: Date,
    },
    mostRecentAvailability: {
        type: Boolean,
    },
    history: [priceHistorySchema],
    link: {
        type: String,
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
    },
});

export const Product: Model<InferSchemaType<typeof productSchema>> = models.Product ?? model("Product", productSchema);

export default mongoose.models?.Product || mongoose.model("Product", productSchema);
