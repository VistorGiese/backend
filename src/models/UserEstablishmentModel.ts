import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class UserEstablishmentModel extends Model {
  userId!: number;
  establishmentId!: number;
}

UserEstablishmentModel.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
    onDelete: 'CASCADE',
  },
  establishmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'establishments', key: 'id' },
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'user_establishment',
  timestamps: false,
});

export default UserEstablishmentModel;
