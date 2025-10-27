import axiosInstance from "@/lib/axiosInstence";

// Notes Services
const getAllNotesData = async (id: string) => {
  const res = await axiosInstance.post("/getallnotes", { autherID: id });
  return res.data;
};
const getANoteData = async (noteId: string) => {
  const res = await axiosInstance.post("/getnote", noteId);
  return res.data;
};
const createNote = async (note: object) => {
  const res = await axiosInstance.post("/createnote", note);
  return res.data;
};

// PlayList Services
const deleteNote = async (noteId: string) => {
  const res = await axiosInstance.post("/deletenote", { noteId });
  return res.data;
};
const addVideo = async (video: object) => {
  const res = await axiosInstance.post("/addvideo", video);
  return res.data;
};
const getAllVideos = async (id: string) => {
  const res = await axiosInstance.post("/getallvideos", { ownerID: id });
  // console.log(res)
  return res.data;
};
const deleteVideo = async (videoId: string) => {
  const res = await axiosInstance.post("/deletevideo", { id: videoId });
  return res.data;
};

// Tasks
async function getAllTasks(userID: string) {
  const res = await axiosInstance.post("/getalltasks", { userID });
  return res.data;
}

// Events
async function getAllEvents() {
  const res = await axiosInstance.get("/events/getallevents");
  return res.data;
}
async function createEvent(data) {
  const res = await axiosInstance.post("/events/createevent", data);
  return res.data;
}

// Books
async function addBook({ id, bookId }) {
  const res = await axiosInstance.post("/addbook", { id, bookId });
  return res.data;
}
async function deleteBook({ id, bookId }) {
  const res = await axiosInstance.post("/deletebook", { id, bookId });
  return res.data;
}
async function getAllBooks({ id }) {
  const res = await axiosInstance.post("/getallbooks", { id });
  return res.data;
}

// Files
async function getFiles({ handlerId }: { handlerId: string }) {
  const res = await axiosInstance.get(`/getfiles/${handlerId}`);
  return res.data;
}

async function uploadFile(formData: FormData) {
  const res = await axiosInstance.post("/uploadfile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

async function deleteFile({
  handlerId,
  id,
}: {
  handlerId: string;
  id: string;
}) {
  const res = await axiosInstance.post("/deletefile", { handlerId, id });
  return res.data;
}
export {
  createEvent,
  getAllNotesData,
  getANoteData,
  createNote,
  deleteNote,
  addVideo,
  getAllVideos,
  deleteVideo,
  getAllTasks,
  getAllEvents,
  addBook,
  deleteBook,
  getAllBooks,
  getFiles,
  deleteFile,
  uploadFile,
};
