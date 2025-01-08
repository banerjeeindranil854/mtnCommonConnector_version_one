package com.mtn.publicConnector.outbound.template;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;


@Validated
@Service
public interface RadisCachingTemplate<T>{
    public T saveData(@NotNull T object);

    public T getData(@NotNull String key,@NotNull String hashKey);

    public boolean checkDuplicate(@NotNull T object);
}
