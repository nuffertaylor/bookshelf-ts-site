import { createStyles, Anchor, Group } from '@mantine/core';
import { defaultProps } from './types/interfaces';

//TODO: The footer styling is all messed up if you have a long list of data that scrolls past the bottom of the page. Fix that.
const useStyles = createStyles((theme) => ({
  footer: {
    position: "absolute",
    bottom: "1vw",
    width:"100%",
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
    },
  },

  links: {
    margin: "auto"
  },
}));

interface link { link: string; label: string }
interface FooterCenteredProps extends defaultProps {
  links: link[];
}

export function FooterCentered({ links, widgetCallback }: FooterCenteredProps) {
  const { classes } = useStyles();
  const link_click = (event : React.MouseEvent<HTMLAnchorElement, MouseEvent>, link : link) => {
    event.preventDefault();
    switch(link.link){
      //TODO: Create About Page
      case "about":
        widgetCallback(<span>about</span>);
        break;
      //TODO: create howto page
      case "howto":
        widgetCallback(<span>howto</span>);
        break;
      //TODO: create api page
      case "api":
        widgetCallback(<span>api</span>);
        break;
      //TODO: create discord for website
      case "discord":
        widgetCallback(<span>discord</span>);
        break;
      default:
        widgetCallback(<span>That link doesn't exist... how did you do this?</span>)
    }
  };

  const items = links.map((link) => (
    <Anchor<'a'>
      color="dimmed"
      key={link.label}
      href={link.link}
      sx={{ lineHeight: 1 }}
      onClick={event => link_click(event, link)}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Group className={classes.links}>{items}</Group>
      </div>
    </div>
  );
}