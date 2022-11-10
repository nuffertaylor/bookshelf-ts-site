import { createStyles, Anchor, Group } from '@mantine/core';
import { About } from './pages/About';
import { AboutApi } from './pages/AboutApi';
import { HowTo } from './pages/HowTo';
import { defaultProps } from './types/interfaces';

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop:"10px",
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
    //this is a cheap hack to disable the active hedaer element, I just don't know a better way to access the header from here
    document.getElementById("bs_site_title")?.click(); 
    switch(link.link){
      case "about":
        widgetCallback(<About/>);
        break;
      case "howto":
        widgetCallback(<HowTo/>);
        break;
      case "api":
        widgetCallback(<AboutApi/>);
        break;
      case "discord":
        window.open("https://discord.gg/E965KYvv6m", "_blank");
        break;
      default:
        widgetCallback(<span>That link doesn't exist... how did you do this?</span>)
    }
  };

  const items = links.map((link) => (
    <Anchor<'a'>
      color="dimmed"
      id={link.link}
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