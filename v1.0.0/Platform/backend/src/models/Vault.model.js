import mongoose from "mongoose";

const vaultSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            maxLength: 30,
            required: true
        },
        code: {
            type: String,
            maxLength: 8,
            minLength: 8
        },
        members: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                }
            ],
            validate: {
                validator: function (val) {
                    return val.length >= 1 && val.length <= 2;
                },
                message: props =>
                    props.value.length === 0
                        ? "At least one member is required."
                        : "Max user limit reached (Maximum 2 members allowed)."
            }
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 60 * 1000)
        },
        status: {
            enum: [
                "created",
                "active",
                "uploaded",
                "locked",
                "preview",
                "swapping",
                "success",
                "aborted",
                "timeout"
            ],
            type: String,
            default: "created"
        },

        participants: [
            {
                _id: false,
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                assets: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Asset"
                    }
                ],
                uploaded: {
                    type: Boolean,
                    default: false
                },
                locked: {
                    type: Boolean,
                    default: false
                },
                previewed: {
                    type: Boolean,
                    default: false
                },
                swapConfirmed: {
                    type: Boolean,
                    default: false
                },
                aborted: {
                    type: Boolean,
                    default: false
                }
            }
        ],

        swap: {
            startedAt: Date,
            completedAt: Date
        }
    },
    { timestamps: true }
);

// Your existing compound query index
vaultSchema.index({ expiresAt: 1, status: 1 });

// NEW: The Partial Unique Index for fast string lookups while ignoring nulls
vaultSchema.index(
    { code: 1 },
    {
        unique: true,
        partialFilterExpression: { code: { $type: "string" } }
    }
);

const Vault = mongoose.model("Vault", vaultSchema);
export default Vault;
