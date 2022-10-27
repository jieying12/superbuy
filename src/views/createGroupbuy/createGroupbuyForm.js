import { useState } from "react"
import { useAuthContext } from '../../hooks/useAuthContext'

import { Button, Container, Box, Typography, TextField, Grid, Modal, Chip, ImageList, ImageListItem, ImageListItemBar, IconButton, Menu, MenuItem, CircularProgress, CardContent, Card, FormControl } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { makeStyles } from "@mui/styles";
import AddImage from '../../assets/AddNewListing.png';
import CustomButton from '../../components/CustomButton';
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import { db, timestamp, storage } from "../../firebase/firebase-config"
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'

const useStyles = makeStyles((theme) => ({
    modalBox: {
        width: '60%',
        maxWidth: '400px',
        background: '#FFFFFF',
        padding: "2em",
        borderRadius: '1em',
        border: '0.1em solid #5EC992',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    imageList: {
        flexWrap: 'nowrap',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'scroll',
    }
}));

const categories = [
    { id: 1, value: 'apparel', label: 'Apparel' },
    { id: 2, value: 'electronics', label: 'Electronics' },
    { id: 3, value: 'cosmetics', label: 'Cosmetics' },
    { id: 4, value: 'footwear', label: 'Footwear' },
    { id: 5, value: 'accessories', label: 'Accessories' },
    { id: 6, value: 'food', label: 'Food' }
]

export default function CreateGroupbuyForm() {
    const navigate = useNavigate()
    const styles = useStyles();
    const { user } = useAuthContext()

    const [isPending, setIsPending] = useState(false)
    // const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const [imageList, setImageList] = useState([])
    const [urls, setUrls] = useState([]);
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState(new Date())
    const [category, setCategory] = useState('')
    const [fee, setFee] = useState('')
    const [shipping, setShipping] = useState('')
    const [min, setMin] = useState('')
    const [tag, setTag] = useState('')
    const [tagList, setTagList] = useState([])
    const [formError, setFormError] = useState(null)

    const [openMenu, setOpenMenu] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [openTagModal, setOpenTagModal] = useState(false)


    const handleOpen = (event) => {
        setOpenMenu(true);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpenMenu(false);
    };

    const handleSetCategory = (cat) => {
        setCategory(cat.value);
        handleClose();
    }

    const handleRemoveCategory = () => {
        setCategory(null);
    };

    const handleAddTag = (e) => {
        e.preventDefault()
        const newTag = tag.trim()
    
        if (newTag && !tagList.includes(newTag)) {
            setTagList(prevTags => [...prevTags, newTag])
        }
        setTag('')
        setOpenTagModal(false);
    }

    const handleRemoveTag = (index) => {
        const newArr = Array.from(tagList);
        newArr.splice(index, 1);
        setTagList(newArr);

    };

    const invalidButtonStyle = {
        textTransform: 'none',
        color: 'white',
    };
    
    const validButtonStyle = {
        background: "#5EC992",
        textTransform: 'none',
        color: 'white',
    };

    const handleAddImage = (e) => {
        if (e.target.files[0]) {
            console.log(e.target.files[0]);
            // let newFile = URL.createObjectURL(e.target.files[0]);
            let files = Array.from(imageList);
            files.push(e.target.files[0]);
            setImageList(files);
        }
    }

    const handleRemoveImage = (index) => {
        let files = Array.from(imageList)
        files.splice(index, 1);
        setImageList(files);
    }

    const handleUpload = (groupbuyId) => {
        const promises = imageList.map((image) => {
            const ref = storage.ref(`groupbuys/${groupbuyId}/images/${image.name}`)
            return ref
              .put(image)
              .then(() => ref.getDownloadURL())
          });
          
          Promise.all(promises)
          .then((urls) => {
            db.collection('groupbuys').doc(groupbuyId).update({ urls })
          })
          .catch(err => console.log(err));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)
        setIsPending(true);

        if (!category) {
            setFormError('Please select a category.')
            return
        }
        if (!title) {
            setFormError('Please enter a title.')
            return
        }
        if (!description) {
            setFormError('Please enter a description.')
            return
        }

        // const createdBy = { 
        //     displayName: user.displayName, 
        //     photoURL: user.photoURL,
        //     id: user.uid
        //   }
      
        // testing
        const createdBy = { 
          displayName: 'jieying', 
          id: 1
        }

        const groupbuy = {
            title,
            description,
            category,
            fee,
            shipping,
            min,
            deadline: timestamp.fromDate(new Date(deadline)),
            tags : [],
            likes : [],
            shares: [],
            comments: [],
            createdBy
        }

        const ref = db.collection('groupbuys')
        try {
            const createdAt = timestamp.fromDate(new Date())
            const addedDocument = await ref.add({ ...groupbuy, createdAt })
            handleUpload(addedDocument.id);
            console.log(urls);
            setIsPending(false);
            setSuccess(true);
            setError(null);
        } catch (err) {
            console.log(err)
            setIsPending(false);
            setSuccess(false);
            setError(err.message);
            navigate.push('/')
        }
    }

    return (
        <>
        <Navbar />
        <Container maxWidth={false} disableGutters style={{ background: '#EDF6EE' }}>
            <Button onClick={() => { navigate(-1) }}>
                <ArrowBackIcon fontSize='large' color='secondary' />
            </Button>
        <Container maxWidth="sm">
            <Box>
                <FormControl sx={{ width: '100%' }}>
                    <Box>
                        <Typography variant='h7' gutterBottom>Photo</Typography>
                    </Box>
                    <Box sx={{ overflowX: 'scroll', display: 'flex' }}>
                        <Box sx={{ display: 'flex', marginBottom: 1 }}>
                            <input
                                accept="image/*"
                                hidden
                                id="add-image"
                                type="file"
                                onChange={handleAddImage}
                            />
                        </Box>

                        <label htmlFor='add-image'>
                            <img src={AddImage} style={{ maxWidth: 150, minWidth: 150, maxHeight: 150, minHeight: 150, cursor: 'pointer' }} alt='add' />
                        </label>
                        <ImageList className={styles.imageList} cols={2.5}>
                            {imageList.length > 0 &&
                                Array.from(imageList).map((image, index) =>
                                    <ImageListItem key={index} style={{ maxWidth: 150, minWidth: 150, maxHeight: 150, minHeight: 150, overflow: 'hidden', marginLeft: 7 }} >
                                        <img src={URL.createObjectURL(image)} loading="lazy" style={{ cursor: 'pointer' }} alt='' />
                                        <ImageListItemBar position="top" sx={{ background: 'none', color: 'black' }}
                                            actionIcon={
                                                <IconButton onClick={() => handleRemoveImage(index)}>
                                                    <CancelIcon />
                                                </IconButton>
                                            } />
                                    </ImageListItem>
                                )
                            }
                        </ImageList>
                    </Box>
                    <Typography variant='h7'>Title*</Typography>
                    <TextField
                        margin="normal"
                        required
                        style={{ width: '100%' }}
                        name="title"
                        value={title}
                        color="secondary"
                        onChange={(e) => setTitle(e.target.value)}
                        error={formError}
                        helperText={formError}
                    />
                    
                    <Typography variant='h7'>Description*</Typography>
                    <TextField
                        margin="normal"
                        required
                        multiline
                        style={{ width: '100%' }}
                        name="description"
                        value={description}
                        color="secondary"
                        onChange={(e) => setDescription(e.target.value)}
                        error={formError}
                        helperText={formError}
                    />

                    <Typography variant='h7'>Category*</Typography>
                    <Grid item xs='auto'>
                        {category && <Chip
                            label={category}
                            key={category}
                            onDelete={handleRemoveCategory}
                            style={{
                                background: "#5EC992",
                                fontWeight: "bold",
                                color: "white",
                                padding: "2.5vh 1.5vw",
                                margin: "0.5em 0.3em 0",
                                borderRadius: "3vh",
                            }}
                        />}
                        {!category && <Button onClick={handleOpen}>
                            <AddCircleOutlineIcon color='secondary' fontSize='large' />
                        </Button>}
                    </Grid>
                    <Menu
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleClose}
                    >
                        {categories.map((cat) => (
                            <MenuItem
                                id={cat.id}
                                value={cat.value}
                                onClick={() => handleSetCategory(cat)}
                            >
                                {cat.label}
                            </MenuItem>
                        ))}
                    </Menu>

                    <Typography variant='h7'>Service Fee</Typography>
                    <TextField
                        margin="normal"
                        required
                        style={{ width: '100%' }}
                        name="fee"
                        value={fee}
                        color="secondary"
                        onChange={(e) => setFee(e.target.value)}
                        error={formError}
                        helperText={formError}
                    />
                    <Typography variant='h7'>Estimated Shipping Cost</Typography>
                    <TextField
                        margin="normal"
                        required
                        style={{ width: '100%' }}
                        name="shipping"
                        value={shipping}
                        color="secondary"
                        onChange={(e) => setShipping(e.target.value)}
                        error={formError}
                        helperText={formError}
                    />
                    <Typography variant='h7'>Minimum number of buyers</Typography>
                    <TextField
                        margin="normal"
                        required
                        style={{ width: '100%' }}
                        name="min"
                        value={min}
                        color="secondary"
                        onChange={(e) => setMin(e.target.value)}
                        error={formError}
                        helperText={formError}
                    />
                    <Typography variant='h7'>Deadline</Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                        className="datepicker"
                        format="dd/MM/yyyy"
                        name = 'deadline'
                        value={deadline}
                        clearable
                        minDate={new Date()}
                        onChange={(date) => {
                            setDeadline(date)
                        }}
                        renderInput={(params) => <TextField color='secondary' style={{ marginTop: '16px', marginBottom: '8px' }} {...params} required/>}
                        sx={{ marginBottom: 2 }}
                        />
                    </LocalizationProvider>
                    <Typography variant='h7'>Tags</Typography>
                    <Grid container spacing={1}>
                        {tagList.length > 0 &&
                            Array.from(tagList).map((tag, index) =>
                                <Grid item xs='auto'>
                                    <Chip
                                        label={tag}
                                        onDelete={() => handleRemoveTag(index)}
                                        style={{
                                            background: "#5EC992",
                                            fontWeight: "bold",
                                            color: "white",
                                            padding: "2.5vh 1.5vw",
                                            margin: "0 0.3em -1.5em",
                                            borderRadius: "3vh",
                                        }}
                                    />
                                </Grid>)
                        }
                        <Grid item xs='auto'>
                            <Button onClick={() => setOpenTagModal(true)}>
                                <AddCircleOutlineIcon color='secondary' fontSize='large' />
                            </Button>
                        </Grid>
                    </Grid>
                   
                    
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <CustomButton
                                variant="contained"
                                fullWidth
                                style={{
                                    background: "#CFD1D8"
                                }}
                                onClick={() => { navigate("/") }}
                                sx={{ minHeight: '50px' }}
                            >
                                <Typography>Cancel</Typography>
                            </CustomButton>

                        </Grid>
                        <Grid item xs={6}>
                            <CustomButton
                                variant="contained"
                                fullWidth
                                color='secondary'
                                sx={{ minHeight: '50px' }}
                                disabled={(error ? true : false)}
                                style={(error ? invalidButtonStyle : validButtonStyle)}
                                onClick={handleSubmit}
                            >
                                <Typography>Create</Typography>
                            </CustomButton>
                        </Grid>
                    </Grid>

                </FormControl>
            </Box>
            <Modal
                open={openTagModal}
                onClose={() => setOpenTagModal(false)}
            >
                <Box className={styles.modalBox}>
                    <div style={{ overflowWrap: 'break-word' }}>
                        Enter New Group Buy Tags
                    </div>
                    <TextField
                        fullWidth
                        color='secondary'
                        required
                        id='tag'
                        value={tag}
                        margin="normal"
                        label="Enter Tag"
                        onChange={(e) => setTag(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <CustomButton
                            variant="contained"
                            onClick={() => setOpenTagModal(false)}
                            sx={{ textTransform: "none", mr: 1, backgroundColor: '#CFD1D8' }}
                        >
                            Cancel
                        </CustomButton>
                        <CustomButton
                            variant="contained"
                            id='tag'
                            color='secondary'
                            value={tag}
                            onClick={handleAddTag}
                            sx={{ textTransform: "none" }}
                        >
                            Add
                        </CustomButton>
                    </Box>
                </Box>
            </Modal>
            <Modal open={isPending} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card sx={{ height: 200, width: 200 }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: 2 }}>
                        <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <CircularProgress color='secondary' sx={{ marginTop: 5 }} />
                            <Typography>Loading...</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Modal>
        </Container>
        </Container>
        </>
    )
}
