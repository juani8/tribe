import { StyleSheet } from 'react-native';
import { useTheme } from 'context/ThemeContext';

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  text: {
    fontSize: 20,
    color: theme.textColor, // Use theme property
  },
});

const { theme } = useTheme();
const styles = createStyles(theme);

export default styles;
