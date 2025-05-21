import axiosInstance from "@/lib/axiosInstence";


const getAllNotesData = async (id: string) => {
    const res = await axiosInstance.post('/getallnotes',{ownerId:id})
    // console.log(res)
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


export { getAllNotesData , getANoteData , createNote }