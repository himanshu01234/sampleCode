const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const { Schema } = mongoose;
const messageSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    conversation: [
      new Schema(
        {
          senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
          receiverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
          deletedUserId: [
            {
              type: Schema.Types.ObjectId,
              ref: 'User',
            },
          ],
          isViewed: {
            type: Boolean,
            default: false,
          },
          message: {
            type: String,
          },
          messageType: {
            type: String,
            default: 'text',
          },
        },
        {
          timestamps: true,
        }
      ),
    ],
  },
  {
    timestamps: true,
  }
);
const message = mongoose.model('message', messageSchema);
module.exports = message;

/**
 * @swagger
 * definitions:
 *   sendMessage:
 *     properties:
 *       senderId:
 *         type: string
 *       receiverId:
 *         type: string
 *       message:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   deleteMessage:
 *     properties:
 *       documentId:
 *         type: string
 *       messageId:
 *         type: string
 */
