import React, { useContext, useEffect, useState } from 'react';
import { createStyles, Header, Container, Group, Burger, Paper, Transition, Switch } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { IconSun, IconMoonStars } from '@tabler/icons';
import { ColorSchemeCtx } from './ColorSchemeContext';

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: theme.colorScheme === 'dark' ? '#4c5265' : '#ffffff'
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: 
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },
}));

interface HeaderResponsiveProps {
  links: { link: string; label: string }[],
  headerClick : Function
}

export function ResponsiveHeader({ links, headerClick }: HeaderResponsiveProps) {
  const [opened, toggleOpened] = useToggle([false, true]);
  const [active, setActive] = useState("");
  const { classes, cx } = useStyles();

  const items = links.map((link) => (
    <a
      key={link.label}
      id={link.link.substring(1)}
      href={link.link}
      className={cx(classes.link, { [classes.linkActive]: active === link.link })}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        toggleOpened(false);
      }}
    >
      {link.label}
    </a>
  ));

  useEffect(()=>{
    headerClick(active);
  // eslint-disable-next-line
  }, [active]);
  const open_landing = ()=>{ 
    headerClick("/landing"); 
    setActive("");
  };
  const { colorScheme, toggleColorScheme} = useContext(ColorSchemeCtx);

  return (
    <Header height={HEADER_HEIGHT} mb={120} className={classes.root}>
      <Container className={classes.header}>
        <div className="bs_title_container">
        <span onClick={open_landing} className="pointer_no_select" id="bs_site_title">📚 My Bookshelf</span>
        <Switch
          checked={colorScheme === "light"}
          onChange={toggleColorScheme}
          size="lg"
          onLabel={<IconSun color="#FFFFFF" size={20} stroke={1.5} />} 
          offLabel={<IconMoonStars color="#FFFFFF" size={20} stroke={1.5} />}
        />
        </div>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>

        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
