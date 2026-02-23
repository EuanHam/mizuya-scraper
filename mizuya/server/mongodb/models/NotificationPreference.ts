import mongoose, { InferSchemaType, Model, Schema, model, models } from "mongoose";

const notificationPreferenceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    vendors: [{
        type: Schema.Types.ObjectId,
        ref: "Vendor",
    }],
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
    }],
}, { timestamps: true });

export const NotificationPreference: Model<InferSchemaType<typeof notificationPreferenceSchema>> = models.NotificationPreference ?? model("NotificationPreference", notificationPreferenceSchema);

export default mongoose.models?.NotificationPreference || mongoose.model("NotificationPreference", notificationPreferenceSchema);
