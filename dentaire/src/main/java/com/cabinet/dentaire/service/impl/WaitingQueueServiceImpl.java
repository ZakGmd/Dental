package com.cabinet.dentaire.service.impl;

import com.cabinet.dentaire.entity.Patient;
import com.cabinet.dentaire.service.interfaces.IWaitingQueueService;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Service
public class WaitingQueueServiceImpl implements IWaitingQueueService {

    // ============== LinkedList for Queue (Academic Requirement) ==============
    // LinkedList is perfect for queues because:
    // - addLast() is O(1) - add patient to end of queue
    // - removeFirst() is O(1) - call next patient from front
    // - Unlike ArrayList, no shifting of elements needed!
    
    private final LinkedList<Patient> waitingQueue = new LinkedList<>();

    @Override
    public void addToQueue(Patient patient) {
        // Add to the END of the queue (FIFO - First In, First Out)
        // O(1) operation with LinkedList
        waitingQueue.addLast(patient);
        System.out.println("Patient added to queue: " + patient.getFirstName() + " " + patient.getLastName());
        System.out.println("Current queue size: " + waitingQueue.size());
    }

    @Override
    public Patient callNextPatient() {
        // Remove and return from the FRONT of the queue
        // O(1) operation with LinkedList
        if (waitingQueue.isEmpty()) {
            System.out.println("No patients in the waiting queue!");
            return null;
        }
        
        Patient nextPatient = waitingQueue.removeFirst();
        System.out.println("Calling patient: " + nextPatient.getFirstName() + " " + nextPatient.getLastName());
        System.out.println("Remaining in queue: " + waitingQueue.size());
        return nextPatient;
    }

    @Override
    public Patient peekNextPatient() {
        // Look at the front without removing
        // O(1) operation with LinkedList
        if (waitingQueue.isEmpty()) {
            return null;
        }
        return waitingQueue.peekFirst();
    }

    @Override
    public List<Patient> getWaitingList() {
        // Return a copy as ArrayList (don't expose internal LinkedList)
        return new ArrayList<>(waitingQueue);
    }

    @Override
    public int getQueueSize() {
        return waitingQueue.size();
    }

    @Override
    public boolean isQueueEmpty() {
        return waitingQueue.isEmpty();
    }

    @Override
    public boolean removeFromQueue(Long patientId) {
        // Remove a specific patient (if they decide to leave)
        // O(n) operation - must search through the list
        for (Patient patient : waitingQueue) {
            if (patient.getId().equals(patientId)) {
                waitingQueue.remove(patient);
                System.out.println("Patient removed from queue: " + patient.getFirstName());
                return true;
            }
        }
        return false;
    }

    @Override
    public int getPatientPosition(Long patientId) {
        // Find patient's position in queue (1-based for human readability)
        int position = 1;
        for (Patient patient : waitingQueue) {
            if (patient.getId().equals(patientId)) {
                return position;
            }
            position++;
        }
        return -1;  // Not found
    }

    @Override
    public void clearQueue() {
        // Clear at end of day
        int size = waitingQueue.size();
        waitingQueue.clear();
        System.out.println("Queue cleared. Removed " + size + " patients.");
    }
}
