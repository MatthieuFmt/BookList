import { RequestOptions, fetchWithRefresh } from "./utils/RefreshToken";

const Test = () => {
  const fetchData = async () => {
    const url = "http://localhost:8000/user";
    // const accessToken = localStorage.getItem("accessToken");
    const accessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MzNlMGJlOWJiYzFlOWI2YzNjM2FiMiIsImVtYWlsIjoibWF0dDFAbWFpbC5jb20iLCJpYXQiOjE2ODExNDAwMzUsImV4cCI6MTY4MTE0MDA5NX0.BeRVzTxu_pH4XZnZQW6tWmloftXmy1rFvuMmT23IwEo";
    const options: RequestOptions = {
      method: "GET",
      headers: {
        Authorization: accessToken || undefined,
      },
    };

    const response = await fetchWithRefresh(url, options);

    if (response.ok) {
      console.log(response);
      const data = await response.json();
      console.log("Data:", data);
    } else {
      console.log("err");

      console.error("Error:", response.status, response.statusText);
    }
  };

  return <div onClick={fetchData}>test</div>;
};

export default Test;
