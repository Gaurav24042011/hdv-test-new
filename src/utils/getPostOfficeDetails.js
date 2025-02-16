import axios from "axios";

export const getPostOfficeDetails = async (pincode) => {
  let postOffice = { isError: false };
  try {
    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = response.data;
    if (data[0].Status.toLowerCase() === "success") {
      postOffice = {
        isError: false,
        state: data[0].PostOffice[0].State,
        city: data[0]?.PostOffice[0]?.District,
        area: data[0]?.PostOffice?.map(pinDetail => pinDetail.Name)
      };
    } else {
      postOffice = { isError: true };
    }
  } catch (error) {
    postOffice = { isError: true };
  }

  return postOffice;
};
