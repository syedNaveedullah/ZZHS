let subListItems = document.getElementsByClassName("list-group-item");

for (let element of subListItems) {
  element.addEventListener("click", (e) => {
    let itemValue = e.target.getAttribute("value");
    console.log(itemValue);
    console.log("working");

    // Assuming you want to update the iframe URL based on the clicked item
    let newVideoURL = "https://www.youtube.com/embed/" + itemValue; // Append the value to create the new video URL
    $("iframe").attr("src", newVideoURL); // Use jQuery to update the iframe src
  });
}
