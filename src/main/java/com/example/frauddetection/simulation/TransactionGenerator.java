package com.example.frauddetection.simulation;

import com.example.frauddetection.model.Transaction;
import com.example.frauddetection.repository.TransactionRepository;
import com.example.frauddetection.service.DetectionService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Random;

@Component
public class TransactionGenerator implements CommandLineRunner {

    private final DetectionService detectionService;
    private final TransactionRepository repository;
    private final Random random = new Random();

    // ✅ THE FIX: Static allows the Controller to see it.
    // Volatile ensures Thread-Safety between the Web Thread and Simulation Thread.
    public static volatile boolean isSimulationRunning = false;
    
    // Override scenario mode
    public static volatile String forceScenario = "RANDOM";

    // Default delay between transactions (2 seconds)
    private static int frequency = 2000;

    public TransactionGenerator(DetectionService detectionService, TransactionRepository repository) {
        this.detectionService = detectionService;
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        // Run the simulation in a separate background thread
        new Thread(() -> {
            String[] users = {"USER_ALEX", "USER_SAM", "USER_JORDAN", "USER_PRIYA", "USER_LIAM"};
            String[] locations = {"Mumbai", "Pune", "Hyderabad", "Chennai", "Delhi"};
            String[] merchants = {"Amazon", "Flipkart", "Netflix", "Steam", "Apple Store"};
            String[] scenarios = {"NORMAL", "SUSPICIOUS", "FRAUD", "ATTACK"};

            while (true) {
                try {
                    if (isSimulationRunning) {
                        // 1. Select a scenario
                        String scenario;
                        if ("RANDOM".equalsIgnoreCase(forceScenario)) {
                            scenario = scenarios[random.nextInt(scenarios.length)];
                        } else {
                            scenario = forceScenario;
                        }
                        
                        Transaction txn = generateBasedOnScenario(scenario);

                        // 2. Fill common metadata
                        txn.setSenderId(users[random.nextInt(users.length)]);
                        txn.setReceiverId("REC_" + random.nextInt(500));
                        txn.setMerchantName(merchants[random.nextInt(merchants.length)]);
                        txn.setTimestamp(LocalDateTime.now());
                        txn.setDeviceId("DEV_" + random.nextInt(1000));

                        if (txn.getLocation() == null) {
                            txn.setLocation(locations[random.nextInt(locations.length)]);
                        }

                        // 3. Set averages for ML calculation
                        double avg = 2000 + random.nextDouble() * 4000;
                        txn.setUserAvgAmount(avg);
                        txn.setAmountVsAvg(txn.getAmount() / avg);

                        // 4. Process through Detection Engine (Rules + ML)
                        detectionService.processTransaction(txn);

                        // 5. Save to H2/Database
                        repository.save(txn);

                        System.out.println(">>> [SIM] Created " + scenario + " txn: ₹" + txn.getAmount());

                        // Wait for the defined frequency
                        Thread.sleep(frequency);
                    } else {
                        // Idle check every 500ms when simulation is OFF
                        Thread.sleep(500);
                    }
                } catch (Exception e) {
                    System.err.println("Simulation Loop Error: " + e.getMessage());
                }
            }
        }).start();
    }

    /**
     * Logic to create different types of transaction patterns
     */
    private Transaction generateBasedOnScenario(String scenario) {
        Transaction t = new Transaction();
        switch (scenario) {
            case "NORMAL":
                t.setAmount(500 + random.nextDouble() * 2000);
                t.setTransactionType("PURCHASE");
                t.setDeviceChange(0);
                t.setLocationChange(0);
                t.setTxnFrequency(1);
                break;
            case "SUSPICIOUS":
                t.setAmount(15000 + random.nextDouble() * 10000);
                t.setTransactionType("TRANSFER");
                t.setDeviceChange(1);
                t.setLocationChange(0);
                t.setTxnFrequency(3);
                break;
            case "FRAUD":
                t.setAmount(80000 + random.nextDouble() * 50000);
                t.setTransactionType("CASH_OUT");
                t.setLocation("Unknown");
                t.setDeviceChange(1);
                t.setLocationChange(1);
                t.setTxnFrequency(15);
                break;
            case "ATTACK":
                t.setAmount(10 + random.nextInt(100));
                t.setTransactionType("UPI_VERIFY");
                t.setTxnFrequency(50); // High velocity
                t.setTxnGap(1); // Rapid succession
                break;
        }
        return t;
    }

    public static void setFrequency(int ms) {
        frequency = ms;
    }
}