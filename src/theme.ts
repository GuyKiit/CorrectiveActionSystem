import { createTheme } from '@mui/material/styles';

// 👇 ส่วนขยาย TypeScript สำหรับสีใหม่
declare module '@mui/material/styles' {
    interface Palette {
        primaryTheme: Palette['primary'];
        primaryWhiteTheme: Palette['primary'];

        dangerLight: Palette['primary'];

        successTheme: Palette['primary'];
        successWhiteTheme: Palette['primary'];

        secondaryTheme: Palette['primary'];

        grayWaiteTheme: Palette['primary'];
    }
    interface PaletteOptions {
        primaryTheme?: PaletteOptions['primary'];
        primaryWhiteTheme?: PaletteOptions['primary'];

        dangerLight?: PaletteOptions['primary'];

        successTheme?: PaletteOptions['primary'];
        successWhiteTheme?: PaletteOptions['primary'];

        secondaryTheme?: PaletteOptions['primary'];
        
        grayWaiteTheme?: PaletteOptions['primary'];
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        primaryTheme: true;
        primaryWhiteTheme: true;

        dangerLight: true;

        successTheme: true;
        successWhiteTheme: true;

        secondaryTheme: true;

        grayWaiteTheme: true;
    }
}

export const theme = createTheme({
    palette: {
        primaryTheme: {
            main: '#0062E9',
            contrastText: '#ffffff',
        },
        primaryWhiteTheme: {
            main: '#0062E9',
            contrastText: '#ffffff',
        },

        successTheme: {
            main: '#00B00C',
            contrastText: '#ffffff',
        },
        successWhiteTheme: {
            main: '#00B00C',
            contrastText: '#ffffff',
        },

        secondaryTheme: {
            main: '#B8B8B8',
            contrastText: '#ffffff',
        },

        grayWaiteTheme: {
            main: '#C0C0C0',
            contrastText: '#000000',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: ({ ownerState, theme }) => {
                    const colorMap: Record<string, { bg: string; hover: string; text: string }> = {
                        primaryTheme: {
                            bg: theme.palette.primaryTheme.main,
                            hover: '#004bb6',
                            text: theme.palette.primaryTheme.contrastText,
                        },
                        successTheme: {
                            bg: theme.palette.successTheme.main,
                            hover: '#008430',
                            text: theme.palette.successTheme.contrastText,
                        },
                        secondaryTheme: {
                            bg: theme.palette.secondaryTheme.main,
                            hover: '#797676',
                            text: theme.palette.secondaryTheme.contrastText,
                        },
                        grayWaiteTheme: {
                            bg: theme.palette.secondaryTheme.main,
                            hover: '#C0C0C0',
                            text: theme.palette.secondaryTheme.contrastText,
                        },

                    };

                    const selected = colorMap[ownerState.color as string];

                    // 🎯 ถ้าเป็น primaryWhiteTheme + outlined
                    if (ownerState.color === 'primaryWhiteTheme' && ownerState.variant === 'outlined') {
                        return {
                            backgroundColor: '#ffffff',
                            border: `1px solid ${theme.palette.primaryWhiteTheme.main}`,
                            color: theme.palette.primaryWhiteTheme.main,
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#f0f8ff',
                                borderColor: '#004bb6',
                                color: '#004bb6',
                            },
                        };
                    }
                    if (ownerState.color === 'successWhiteTheme' && ownerState.variant === 'outlined') {
                        return {
                            backgroundColor: '#ffffff',
                            border: `1px solid ${theme.palette.successWhiteTheme.main}`,
                            color: theme.palette.successWhiteTheme.main,
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#e8f5e9', 
                                borderColor: '#C0C0C0',
                                color: '#008430',
                            },
                        };
                    }
                     if (ownerState.color === 'grayWaiteTheme' && ownerState.variant === 'outlined') {
                        return {
                            backgroundColor: '#ffffff',
                            border: `1px solid ${theme.palette.successWhiteTheme.main}`,
                            color: theme.palette.successWhiteTheme.main,
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#C0C0C0', 
                                borderColor: '#000000',
                                color: '#000000',
                            },
                        };
                    }

                    if (selected) {
                        return {
                            backgroundColor: selected.bg,
                            color: selected.text,
                            '&:hover': {
                                backgroundColor: selected.hover,
                            },
                        };
                    }

                    return {};
                },
            },
        },
    },
});
