package com.cabinet.dentaire.service.interfaces;

import com.cabinet.dentaire.entity.Patient;

import java.util.List;

public interface IWaitingQueueService {

    
    // Add patient to the end of the queue
    void addToQueue(Patient patient);
    
    // Remove and return the next patient (from the front)
    Patient callNextPatient();
    
    // See who's next without removing them
    Patient peekNextPatient();
    
    // Get the entire queue as a list
    List<Patient> getWaitingList();
    
    // Get queue size
    int getQueueSize();
    
    // Check if queue is empty
    boolean isQueueEmpty();
    
    // Remove a specific patient from queue (if they leave)
    boolean removeFromQueue(Long patientId);
    
    // Get patient's position in queue (1-based)
    int getPatientPosition(Long patientId);
    
    void clearQueue();
}
