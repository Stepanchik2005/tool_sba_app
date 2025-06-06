package com.example.demo.dto.set;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SetResponse {
    private Long id;
    private ToolHolderDTO toolHolder;
    private InstrumentDTO instrument;
    private ToolAdapterDTO toolAdapter;
    private UserDTO user;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ToolHolderDTO {
        private Long id;
        private String name;
        private String marking;
        private String articleNumber;
        private String link;
        private String supplierName;
        private String brandName;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InstrumentDTO {
        private Long id;
        private String name;
        private String marking;
        private String articleNumber;
        private String link;
        private String supplierName;
        private String brandName;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ToolAdapterDTO {
        private Long id;
        private String name;
        private String marking;
        private String articleNumber;
        private String link;
        private String supplierName;
        private String brandName;

    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserDTO {
        private Long id;
        private String username;
        private String role;
    }

}
