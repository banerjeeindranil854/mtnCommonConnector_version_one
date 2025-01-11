package com.mtn.publicConnector.validation.validation;



import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = PhoneNumberCodeTypeValidator.class)
public @interface PhoneNumberCodeType {

    String message() default "PhoneNumber should start with 91";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}