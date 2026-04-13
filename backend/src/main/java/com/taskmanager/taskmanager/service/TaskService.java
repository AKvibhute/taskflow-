package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.model.Task;
import com.taskmanager.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository repository;

    public List<Task> getAllTasks() {
        return repository.findByDeletedFalse();
    }

    public List<Task> getDeletedTasks() {
        return repository.findByDeletedTrue();
    }

    public Task saveTask(Task task) {
        return repository.save(task);
    }

    public Task updateTask(Long id, Task updated) {
        Task task = repository.findById(id).orElseThrow();
        task.setTitle(updated.getTitle());
        task.setStatus(updated.getStatus());
        return repository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = repository.findById(id).orElseThrow();
        task.setDeleted(true);
        task.setDeletedAt(LocalDateTime.now());
        repository.save(task);
    }
}