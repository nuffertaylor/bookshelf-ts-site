// import { createStyles, Text } from '@mantine/core';
// import { useListState } from '@mantine/hooks';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { foundBook } from '../types/interfaces';

// const useStyles = createStyles((theme) => ({
//   item: {
//   display: 'flex',
//   alignItems: 'center',
//   borderRadius: theme.radius.md,
//   border: `1px solid ${
//     theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
//   }`,
//   padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
//   paddingLeft: theme.spacing.xl - theme.spacing.md, // to offset drag handle
//   backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
//   marginBottom: theme.spacing.sm,
//   },

//   itemDragging: {
//   boxShadow: theme.shadows.sm,
//   },

//   symbol: {
//   fontSize: 30,
//   fontWeight: 700,
//   width: 60,
//   },

//   dragHandle: {
//   ...theme.fn.focusStyles(),
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   height: '100%',
//   color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
//   paddingLeft: theme.spacing.md,
//   paddingRight: theme.spacing.md,
//   },
// }));

// interface dragAndDropListProps {
//   data: foundBook[]
// }

// export function DragAndDropList({ data }: dragAndDropListProps) {
//   const { classes, cx } = useStyles();
//   const [state, handlers] = useListState(data);

//   const items = state.map((item, index) => (
  
//   <Draggable key={item.upload_id} index={index} draggableId={item.upload_id}>
//     {(provided : any, snapshot : any) => (
//     <div
//       className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
//       {...provided.draggableProps}
//       {...provided.dragHandleProps}
//       ref={provided.innerRef}
//     >
//       <div style={{background : item.domColor, width:"25px", height:"25px"}}></div>
//       <div>
//       <Text>{item.title.length > 25 ? item.title.substring(0,25) + "..." : item.title}</Text>
//       <Text color="dimmed" size="sm">
//         Author: {item.author} • Published: {item.pubDate}
//       </Text>
//       </div>
//     </div>
//     )}
//   </Draggable>
//   ));

//   return (
//   <DragDropContext//@ts-ignore
//     onDragEnd={({ destination, source}) =>
//     handlers.reorder({ from: source.index, to: destination?.index || 0 })
//     }
//   >
//     <Droppable droppableId="dnd-list" direction="vertical">
//     {(provided : any) => (
//       <div {...provided.droppableProps} ref={provided.innerRef}>
//       {items}
//       {provided.placeholder}
//       </div>
//     )}
//     </Droppable>
//   </DragDropContext>
//   );
// }

import React from 'react';
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
}));

interface dragAndDropListProps {
  data: foundBook[];
}

export function DragAndDropList({ data }: dragAndDropListProps) {
  const { classes, cx } = useStyles();
  const [state, handlers] = useListState(data);

  const items = state.map((item, index) => (
    <Draggable key={item.upload_id} index={index} draggableId={item.upload_id}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div style={{background : item.domColor, width:"25px", height:"25px"}}></div>
          <div>
          <Text>{item.title.length > 25 ? item.title.substring(0,25) + "..." : item.title}</Text>
          <Text color="dimmed" size="sm">
            Author: {item.author} • Published: {item.pubDate}
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