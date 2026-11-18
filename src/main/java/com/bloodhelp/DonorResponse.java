package com.bloodhelp;

public class DonorResponse {

    private Long id;
    private String name;
    private int age;
    private String bloodGroup;
    private String phone;
    private String city;
    private boolean verified;
    private boolean available;
    private boolean canEdit;

    public DonorResponse(Donor donor, String currentUsername) {
    this.id = donor.getId();
    this.name = donor.getName();
    this.age = donor.getAge();
    this.bloodGroup = donor.getBloodGroup();
    this.phone = donor.getPhone();
    this.city = donor.getCity();
    this.verified = donor.isVerified();
    this.available = donor.isAvailable();

    this.canEdit = currentUsername != null && (
            currentUsername.equals(donor.getRegisteredByUsername())
            ||
            (donor.getRegisteredBy() != null
                    && currentUsername.equals(
                            donor.getRegisteredBy().getUsername()))
    );
}

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public String getPhone() {
        return phone;
    }

    public String getCity() {
        return city;
    }

    public boolean isVerified() {
        return verified;
    }

    public boolean isAvailable() {
        return available;
    }

    public boolean isCanEdit() {
        return canEdit;
    }
}