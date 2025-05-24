import axiosInstance from "@/lib/axiosInstence";

// Notes Services
const getAllNotesData = async (id: string) => {
    const res = await axiosInstance.post('/getallnotes',{ownerId:id})
    return res.data
}

const getANoteData = async (noteId: string) => {
    const res = await axiosInstance.post('/getnote',noteId)
    return res.data
}

const createNote = async (note: object) => {
    const res = await axiosInstance.post('/createnote',note);
    return res.data
}

// PlayList Services
const deleteNote = async (noteId: string) => {
    const res = await axiosInstance.post('/deletenote',{noteId})
    return res.data
}

const addVideo = async (video: object) => {
    const res = await axiosInstance.post('/addvideo',video)
    return res.data
}

const getAllVideos = async (id: string) => {
    const res = await axiosInstance.post('/getallvideos',{ownerID: id})
    // console.log(res)
    return res.data
}

const deleteVideo = async (videoId: string) => {
    const res = await axiosInstance.post('/deletevideo',{id: videoId})
    return res.data
}

export { getAllNotesData , getANoteData , createNote , deleteNote ,addVideo , getAllVideos , deleteVideo}
