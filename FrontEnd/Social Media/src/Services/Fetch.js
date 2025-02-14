export const fetchData = async (link, method) => {
  const data = await fetch(link.toString(), {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const jsonData = await data.json();
};

export const logOutUser = async () => {
  const data = await fetch("/user/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const jsonData = await data.json();
  console.log(jsonData);
  return jsonData;
};
