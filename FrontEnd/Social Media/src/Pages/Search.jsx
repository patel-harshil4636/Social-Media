import { useEffect, useState } from "react";
import Nav from "../Component/Nav";
import { useParams } from "react-router-dom";

function UserSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userName, setUserNames] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      // Make a request to your API here

      const response = await fetch("/user/AllUsers", {
        mathod: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonData = await response.json();
      const names = jsonData.map((user) => user.userName); // mapping is the method to the get array.....
      setUserNames(names);
    };
    getUser(); //userName?.filter((name)=>name.userName.includes('AD47'))

    document.addEventListener("keyup", (e) => {
      if (e.key == "Escape") {
      }
    });
  }, []);

  // console.log(userName);
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredUsers([]);
    } else {
      const filtered = userName.filter((user) =>
        user.toLowerCase().includes(term),
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <>
      <Nav></Nav>
    </>
  );
}

export default UserSearch;
