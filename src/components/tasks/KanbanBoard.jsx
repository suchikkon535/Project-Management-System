'use client';

import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useApp } from '@/context/AppContext';
import TaskCard from '@/components/shared/TaskCard';
import EditTaskModal from '@/components/tasks/EditTaskModal';
import EmptyState from '@/components/shared/EmptyState';
import { Plus } from 'lucide-react';
import CreateTaskModal from '@/components/tasks/CreateTaskModal';

const columns = [
  { id: 'todo', title: 'Todo', color: '#64748b' },
  { id: 'in-progress', title: 'In Progress', color: '#4F46E5' },
  { id: 'done', title: 'Done', color: '#10B981' },
];

export default function KanbanBoard({ tasks, projectId }) {
  const { moveTask } = useApp();
  const [editingTask, setEditingTask] = useState(null);
  const [createStatus, setCreateStatus] = useState(null);

  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      const { draggableId, destination } = result;
      moveTask(draggableId, destination.droppableId);
    },
    [moveTask]
  );

  if (tasks.length === 0) {
    return <EmptyState type="tasks" />;
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((column) => {
            const columnTasks = tasks.filter((t) => t.status === column.id);
            return (
              <div key={column.id} className="flex flex-col">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-muted px-1.5 text-[11px] font-medium text-muted-foreground">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setCreateStatus(column.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent transition-colors"
                    aria-label={`Add task to ${column.title}`}
                  >
                    <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>

                {/* Droppable Column */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 rounded-2xl p-2 min-h-[200px] transition-colors duration-200 ${
                        snapshot.isDraggingOver
                          ? 'bg-primary/5 border-2 border-dashed border-primary/20'
                          : 'bg-muted/30'
                      }`}
                    >
                      {columnTasks.map((task, index) => {
                        const taskId = task._id || task.id;
                        return (
                          <Draggable key={taskId} draggableId={taskId} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskCard
                                  task={task}
                                  isDragging={snapshot.isDragging}
                                  onClick={() => setEditingTask(task)}
                                />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {editingTask && (
        <EditTaskModal
          open={!!editingTask}
          onClose={() => setEditingTask(null)}
          task={editingTask}
          projectId={projectId}
        />
      )}

      {createStatus && (
        <CreateTaskModal
          open={!!createStatus}
          onClose={() => setCreateStatus(null)}
          projectId={projectId}
          defaultStatus={createStatus}
        />
      )}
    </>
  );
}
