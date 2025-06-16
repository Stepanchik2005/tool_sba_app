package com.example.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler
{
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex)
    {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "User not found",
                ex.getMessage()
        );
        return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex)
    {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                ex.getMessage()
        );
        return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExists(UserAlreadyExistsException ex)
    {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.CONFLICT.value(), "Користувач вже зареєстрований", ex.getMessage());

        return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.CONFLICT);
    }
    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleEmailAlreadyExists(EmailAlreadyExistsException ex)
    {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.CONFLICT.value(), "Email already exists", ex.getMessage());

        return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.CONFLICT);
    }
    @ExceptionHandler(PasswordNotFoundException.class)
    public ResponseEntity<ErrorResponse> handlePasswordNotFound(PasswordNotFoundException ex)
    {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(), "Password not found", ex.getMessage());

        return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(UserUnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUserUnauthorized(UserUnauthorizedException ex)
    {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(), "Unauthorized", ex.getMessage());

        return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.UNAUTHORIZED);
    }
    @ExceptionHandler(EnterpriseNotExistsException.class)
    public ResponseEntity<ErrorResponse> handleEnterpriseNotExists(EnterpriseNotExistsException ex)
    {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(), "Enterprise not found", ex.getMessage());

        return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(InvalidInputException.class)
    public ResponseEntity<ErrorResponse> handleInvalidInput(InvalidInputException ex)
    {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(), ex.getMessage());

        return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EnterpriseAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleEnterpriseAlreadyExists(EnterpriseAlreadyExistsException ex)
    {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.CONFLICT.value(), "Enterprise already exists", ex.getMessage());

        return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.CONFLICT);
    }
}
