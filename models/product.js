// Common Js 에서 export하는 문법
module.exports = function (sequelize, DataTypes) {
  //테이블을 만든다 이름은 "Product"
  const product = sequelize.define("Product", {
    //컬럼들을 만든다 이름은
    //각각 name, price, seller, description, imageUrl
    name: {
      // type : 컬럼의 데이터 타입
      // ()속의 숫자는 길이를 20까지 제한
      type: DataTypes.STRING(20),
      // Product라는 테이블에 값을 넣을 때
      // 무조건 name이라는 컬럼에 값이 있어야 한다는 의미 false
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    seller: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    soldout: {
      // 0이면 false 1이면 true
      type: DataTypes.INTEGER(1),
      allowNull: false,
      // 레코드가 생성될 때  즉 상품이 업로드 될때 기본 디폴트값
      // 판매되지 않았다는 의미의 0
      defaultValue: 0,
    },
  });
  return product;
};
