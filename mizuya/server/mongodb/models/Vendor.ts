import mongoose, { InferSchemaType, Model, Schema, model, models } from "mongoose";

const vendorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
    }],
    website: {
        type: String,
        required: true,
    }
});

export const Vendor: Model<InferSchemaType<typeof vendorSchema>> = models.Vendor ?? model("Vendor", vendorSchema);

export default mongoose.models?.Vendor || mongoose.model("Vendor", vendorSchema);