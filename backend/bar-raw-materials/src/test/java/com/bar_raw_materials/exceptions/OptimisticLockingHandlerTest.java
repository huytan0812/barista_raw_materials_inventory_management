package com.bar_raw_materials.exceptions;

import com.bar_raw_materials.controllers.staff.ExportItemController;
import com.bar_raw_materials.entities.GoodsReceiptItem;
import com.bar_raw_materials.services.exportItem.ExportItemService;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class OptimisticLockingHandlerTest {
    private final ExportItemService exportItemService = mock(ExportItemService.class);
    private final MockMvc mockMvc = MockMvcBuilders
            .standaloneSetup(new ExportItemController(exportItemService))
            .setControllerAdvice(new GlobalExceptionHandler())
            .addPlaceholderValue("apiStaff", "/staff")
            .build();

    @Test
    void concurrentCreateReturns409WithMessage() throws Exception {
        when(exportItemService.create(any()))
                .thenThrow(new ObjectOptimisticLockingFailureException(GoodsReceiptItem.class, 1));

        mockMvc.perform(post("/staff/exportItem/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"grnItemId\":1,\"quantityTake\":3,\"salesItemId\":7}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.concurrentUpdate").isNotEmpty());
    }

    @Test
    void concurrentDeleteReturns409() throws Exception {
        doThrow(new ObjectOptimisticLockingFailureException(GoodsReceiptItem.class, 1))
                .when(exportItemService).delete(100);

        mockMvc.perform(get("/staff/exportItem/delete/100"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.concurrentUpdate").isNotEmpty());
    }
}
