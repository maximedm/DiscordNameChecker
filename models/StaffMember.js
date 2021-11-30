module.exports = (sequelize, DataTypes) => {
	return sequelize.define('StaffMember', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		username: DataTypes.STRING,
	});
};