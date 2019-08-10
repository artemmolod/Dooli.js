JavaScript libraly for react app
====================

v0.0.2

**Example:**

```javascript
import React from 'react';
import { createStyles } from "@dooli/styles";

const styles = createStyles({
    button: {
        backgroundColor: '#232322',
        color: '#fff',
        borderRadius: '4px',
        border: 'none',
        padding: '9px 15px 10px',
        
        ':hover': {
            opacity: .6,
        }
    }
});

class Button extends React.Component {
    render() {
        const useStyles = styles();
        return (
            <button className={useStyles.button}>button</button>
        );
    }
}
```

**Copy CSS properties:**

```javascript
const styles = createStyles({
    button: {
        backgroundColor: '#232322',
        color: '#fff',
        borderRadius: '4px',
        border: 'none',
        padding: '9px 15px 10px',
        
        ':hover': {
            opacity: .6,
        }
    },
    'button-login': {
        "@copy": "button",
        textTransform: "uppercase",
    },
    'button-sign': {
        ':hover': {
            "@copy": "button:hover"
        }
    }
});

```

**Prefix**
```javascript
const styles = createStyles({
    button: {...}
}, {
    prefix: "MyPrefix"
})()
```

Use: `styles.button` => Output => `MyPrefix__button`