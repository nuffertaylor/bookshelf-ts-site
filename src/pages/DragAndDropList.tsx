import React, { useEffect } from 'react';
import { createStyles, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { foundBook } from '../types/interfaces';

const useStyles = createStyles((theme) => ({
  item: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  symbol: {
    fontSize: 30,
    fontWeight: 700,
    width: 60,
  },

  titleContainer: {
    width: '100%',
    marginLeft: '10px',
    overflow: 'hidden',
    minWidth: 0,
  },

  titleText: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    '&.scrolling': {
      animation: 'scrollText 12s linear infinite',
      '@keyframes scrollText': {
        '0%': {
          transform: 'translateX(0)',
        },
        '100%': {
          transform: 'translateX(-34%)',
        },
      },
    },
  },
}));

interface dragAndDropListProps {
  data: foundBook[],
  updateParent : Function
}

export function DragAndDropList({ data, updateParent }: dragAndDropListProps) {
  const { classes, cx } = useStyles();
  const [state, handlers] = useListState(data);
  useEffect(()=>{
    updateParent(state);
  }, [updateParent, state]);

  const items = state.map((item, index) => (
    <Draggable index={index} draggableId={item.upload_id} key={item.upload_id}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div style={{background : item.domColor, minWidth:"25px", minHeight:"25px"}}></div>
          <div className={classes.titleContainer}>
            <Text 
              style={{fontWeight:700}}
              className={cx(classes.titleText, { scrolling: item.title.length > 25 })}
            >
              {item.title.length > 25 ? `${item.title} • ${item.title} • ${item.title}` : item.title}
            </Text>
            <Text color="dimmed" size="sm" style={{fontStyle:"italic"}}>
              Author: {item.author} {!!item.pubDate ? '• Published: ' + item.pubDate : ''}
            </Text>
          </div>
        </div>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
      }
    >
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}