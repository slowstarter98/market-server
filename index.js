const express = require("express");
const cors = require("cors");
//sequelize init 명령으로 생성한 코드들을 불러온다
const models = require("./models");
// express 사용하기 위한 객체
const app = express();
const port = process.env.PORT || 8080;

//multer import
const multer = require("multer");
// uploads 라는 경로에 저장하겠다는 의미
//업로드 되는 이미지들의 이름을 원래 이름대로 사용하기 위한 코드
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, res, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

//express 서버에서 json 형태를 사용하기 위해 설정
app.use(express.json());
//허용범위 해제
app.use(cors());
app.use("/uploads", express.static("uploads"));

//-----------------------------------------------------------------
//get 요청이 들어왔을 때
// /products 에 관한 API라고 할 수 있다.
app.get("/products", (req, res) => {
  //query가 있으면 query를 사용하는 코드
  const query = req.query;
  console.log("Query : ", query);

  //get 요청에서 DB 전체를 훑어서 반환해주는 코드
  //findAll은 복수개 즉 2개 이상의 레코드를 조회할 때 사용
  models.Product.findAll({
    //Table이 너무 클때 레코드 단위로 조회하는 범위를
    // 설정해주는 코드 limit

    //상품정보를 불러올 때 id 순으로 불러오는게 default
    // 그걸 바꿔주는 코드 order
    order: [
      // 생성시간순 , 내림차순
      ["createdAt", "DESC"],
    ],
    //findAll을 할때 어떤 정보들을 가져올 것이냐 즉
    // 필요한 column 데이터만 선택하는 코드 attributes
    attributes: [
      "id",
      "name",
      "price",
      "seller",
      "createdAt",
      "imageUrl",
      "soldout",
    ],
  })
    .then((result) => {
      console.log("Products : ", result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("에러발생");
    });
});

//-----------------------------------------------------------------
// 파라미터를 이용해서  DB에서 파라미터에 맞는
// 데이터를 받아오는 코드
app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    // 조건에 맞는 데이터를 찾는 코드
    //조건 코드는 find? 함수 속에 넣는다
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("PRODUCT : ", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("에러가 발생했습니다.");
    });
});

//-----------------------------------------------------------------
//post 요청이 들어왔을 때
app.post("/products", function (req, res) {
  const body = req.body;
  const { name, description, price, seller, imageUrl } = body;

  // 벡엔드 개발자들이 사용하는 '방어코드'
  // 입력이 올바르지 않을 경우 로직을 빼지게 한다
  if (!name || !description || !price || !seller || !imageUrl) {
    res.status(400).send("모든 필드를 입력해주세요");
  }

  // Product 테이블에 dataset을 생성하는 코드
  // DB랑 소통하는 작업은 기본적으로 '비동기'방식이다
  // 그래서 Promise객체를 지원한다
  models.Product.create({
    name,
    description,
    price,
    seller,
    imageUrl,
  })
    .then((result) => {
      console.log("생성결과 : ", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.log("업로드 문제발생 : ", error);
      res.status(400).send("업로드에 문제가 발생했습니다.");
    });
});

//-----------------------------------------------------------------
// multer 사용한 API
// 단일 파일을 처리할 때 single
// 파일을 보낼때는 항상 key가 필요하다 이때 이름을 'image'로 설정
app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path,
  });
});

//-----------------------------------------------------------------
app.listen(port, () => {
  console.log("쇼핑몰 서버가 실행되고 있습니다.");
  // models에 테이블 관련된 모델링에 필요한 정보를 넣을때 사용
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB연결 성공");
    })
    .catch((error) => {
      console.error(error);
      console.log("DB 연결 에러");
      process.exit();
    });
});

//-----------------------------------------------------------------
app.get("/banners", (req, res) => {
  models.Banner.findAll({
    limit: 2,
  })
    .then((result) => {
      res.send({
        banners: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러발생");
    });
});
//-----------------------------------------------------------------
// 결제하기 요청

app.post("/purchase/:id", (req, res) => {
  const { id } = req.params;
  //update의 2번째 인자는 어디를 수정할지 찾는 인자
  models.Product.update(
    {
      // 요청이 오면 일단 soldout됬다고 체크
      soldout: 1,
    },
    {
      where: {
        id,
      },
    }
  )
    .then((result) => {
      res.send({
        result: true,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러가 발생했습니다.");
    });
});
