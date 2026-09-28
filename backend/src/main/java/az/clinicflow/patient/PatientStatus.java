package az.clinicflow.patient;

public enum PatientStatus {
    ACTIVE("Active"), FOLLOW_UP("Follow-up");

    private final String label;

    PatientStatus(String label) { this.label = label; }

    public String getLabel() { return label; }
}
