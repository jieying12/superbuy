
import React from 'react'
import { useState } from 'react'
import { Link as RouterLink } from "react-router-dom";
import { useSignup } from '../../hooks/useSignup'
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CustomButton from '../../components/CustomButton';

export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [username, setUsername] = useState('')
    const { signup, isPending, error } = useSignup()

    const handleSubmit = (e) => {
        e.preventDefault()
        signup(email, password, username)
    }

    const handleShowPassword = () => setShowPassword(!showPassword);

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" fontWeight="bold">
                    Sign Up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type="email"
                        id="email"
                        label="Email address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        color="secondary"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type="username"
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        color="secondary"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'} value={password}
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        color="secondary"
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />
                    {!isPending &&
                        <CustomButton variant='contained' color="secondary"
                            type="submit"
                            fullWidth
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </CustomButton>
                    }
                </Box>
                <div style={{ display: "flex", flexDirection: "row", position: "absolute", bottom: 20 }}>
                    <Typography variant="body2">Have an account?</Typography>
                    <Link component={RouterLink} to="/login" variant="body2" color="secondary" style={{ paddingLeft: 4 }}>
                        Login
                    </Link>
                </div>
                {isPending && <button className="btn" disabled>loading</button>}
                {error && <p>{error}</p>}
            </Box>
        </Container >
    )
}