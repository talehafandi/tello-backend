import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, './assets')
    },
    filename: function (_req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })

  export default upload