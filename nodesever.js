var http = require("http");
// 127.0.0.1 = 모든 컴퓨터 기준 자기자신의 주소(내부IP)
var hostname = "127.0.0.1";
var port = 8080;

const server = http.createServer(function (req, res) {
  // 요청에서 url과 어떤 method로 요청했는지 데이터를 받는다.
  const path = req.url;
  const method = req.method;

  // 추가 주소에 따라 응답해주는 데이터가 다르기 때문에 if문 사용
  if (path === "/products") {
    // 요청 method에 따라 응답해주는 데이터가 다르기 때문에 if문 사용
    if (method === "GET") {
      //NODE.JS에서 배열을 보내줄 대에는 writeHead를 사용
      //Head는 http 통신에서의 header와 body부분중 header부분을 의미
      //정상 요청인 경우 첫번째 인자 status code:200를 응답해준다
      //서버에서 응답을 보낼때 어떤 형식의 응답이냐
      // 나는 json형식의 응답을 보낼 것이다 라고
      // 응답 Header에 미리 표시해 준다
      // 어던 형식의 컨텐츠 타입을 쓸건지 표시하지 않으면
      // 서버에서 오류가 날 수 있다.
      res.writeHead(200, { "Content-Type": "application/json" });

      //end의 첫번째 인자에는 string이 들어가야 한다
      //end는 서버에서 작성한 응답메세지를 보내고 코드를 마무리할 때 사용
      res.end(
        // js의 배열 형태를 string으로 바꿔주는 함수 == JSON객체이 있는
        // stringify함수
        JSON.stringify([
          {
            name: "농구공",
            price: 5000,
          },
        ])
      );
    } else if (method === "POST") {
      res.end("생성되었습니다.");
    }
  } else {
    res.end("Good Bye");
  }
});
// listen = 컴퓨터용어에서는 '기달리고 있다'라는 의미
//여기서는 포트와 호스트네임을 입력받기를 기달린다는 의마
server.listen(port, () => {
  console.log("시작");
});
console.log("market server on!");
