import React, { ReactElement } from "react";
import { Accordion, createStyles } from '@mantine/core';
import nextId from "react-id-generator";

const useStyles = createStyles((theme) => ({
  item: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    textAlign:"left",
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

export interface FaqItem{
  value : string,
  control: string,
  panel: string | ReactElement
}
interface FaqProps{items : FaqItem[]}
interface AccordianItemProps{item : FaqItem}
const AccordianItem = ({ item } : AccordianItemProps) => {
  const { classes } = useStyles();
  return (
    <Accordion.Item className={classes.item} value={item.value} key={nextId()}>
      <Accordion.Control>{item.control}</Accordion.Control>
      <Accordion.Panel>{item.panel}</Accordion.Panel>
    </Accordion.Item>
  );
}
export function Faq({ items } : FaqProps){
  const accordian_items = items.map(i => <AccordianItem item={i}/>)
  return (
    <Accordion variant="separated">
      {accordian_items}
    </Accordion>
  )
}